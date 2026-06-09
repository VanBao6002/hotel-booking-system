function downloadBlob(filename, blob) {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
}

function csvCell(value) {
    const text = String(value ?? "");
    return `"${text.replace(/"/g, '""')}"`;
}

export function reportDateStamp(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export function downloadCsv(filename, headers, rows) {
    const content = [
        headers.map(csvCell).join(","),
        ...rows.map(row => row.map(csvCell).join(",")),
    ].join("\r\n");
    downloadBlob(filename, new Blob(["\ufeff", content], { type: "text/csv;charset=utf-8" }));
}

export async function downloadTablePdf({
    filename,
    title,
    headers,
    rows,
    columnWidths = [],
}) {
    const pageWidth = 1600;
    const pageHeight = 1131;
    const rowsPerPage = 18;
    const pageCount = Math.max(1, Math.ceil(rows.length / rowsPerPage));
    const generatedAt = new Date().toLocaleString("vi-VN");
    const pageImages = [];

    for (let pageIndex = 0; pageIndex < pageCount; pageIndex++) {
        const pageRows = rows.slice(pageIndex * rowsPerPage, (pageIndex + 1) * rowsPerPage);
        const canvas = renderPage({
            pageWidth,
            pageHeight,
            title,
            headers,
            rows: pageRows,
            columnWidths,
            pageNumber: pageIndex + 1,
            pageCount,
            generatedAt,
        });
        const blob = await canvasToJpegBlob(canvas);
        pageImages.push(new Uint8Array(await blob.arrayBuffer()));
    }

    downloadBlob(filename, buildImagePdf(pageImages, pageWidth, pageHeight));
}

function renderPage({
    pageWidth,
    pageHeight,
    title,
    headers,
    rows,
    columnWidths,
    pageNumber,
    pageCount,
    generatedAt,
}) {
    const canvas = document.createElement("canvas");
    canvas.width = pageWidth;
    canvas.height = pageHeight;
    const ctx = canvas.getContext("2d");
    const margin = 54;
    const tableWidth = pageWidth - margin * 2;
    const headerY = 178;
    const rowHeight = 44;
    const normalizedWidths = normalizeWidths(columnWidths, headers.length);
    const columns = normalizedWidths.map((ratio, index) => ({
        x: margin + normalizedWidths.slice(0, index).reduce((sum, value) => sum + value, 0) * tableWidth,
        width: ratio * tableWidth,
    }));

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, pageWidth, pageHeight);

    ctx.fillStyle = "#1b3055";
    ctx.font = "700 38px Arial, sans-serif";
    ctx.fillText("PTBL Booking Hotel", margin, 60);

    ctx.fillStyle = "#c8a96c";
    ctx.fillRect(margin, 78, tableWidth, 5);

    ctx.fillStyle = "#1a1a2e";
    ctx.font = "700 30px Arial, sans-serif";
    ctx.fillText(title, margin, 126);

    ctx.fillStyle = "#667085";
    ctx.font = "16px Arial, sans-serif";
    ctx.fillText(`Tạo lúc: ${generatedAt}`, margin, 154);
    ctx.textAlign = "right";
    ctx.fillText(`Trang ${pageNumber}/${pageCount}`, pageWidth - margin, 154);
    ctx.textAlign = "left";

    ctx.fillStyle = "#1b3055";
    ctx.fillRect(margin, headerY, tableWidth, rowHeight);
    ctx.fillStyle = "#ffffff";
    ctx.font = "700 16px Arial, sans-serif";
    headers.forEach((header, index) => {
        ctx.fillText(fitText(ctx, header, columns[index].width - 20), columns[index].x + 10, headerY + 28);
    });

    rows.forEach((row, rowIndex) => {
        const y = headerY + rowHeight * (rowIndex + 1);
        ctx.fillStyle = rowIndex % 2 === 0 ? "#ffffff" : "#f7f6f2";
        ctx.fillRect(margin, y, tableWidth, rowHeight);
        ctx.strokeStyle = "#e8e4dc";
        ctx.beginPath();
        ctx.moveTo(margin, y + rowHeight);
        ctx.lineTo(margin + tableWidth, y + rowHeight);
        ctx.stroke();

        ctx.fillStyle = "#27364d";
        ctx.font = "16px Arial, sans-serif";
        row.forEach((value, columnIndex) => {
            const column = columns[columnIndex];
            if (!column) return;
            ctx.fillText(fitText(ctx, value, column.width - 20), column.x + 10, y + 28);
        });
    });

    ctx.fillStyle = "#667085";
    ctx.font = "15px Arial, sans-serif";
    ctx.fillText(`Tổng số bản ghi: ${rows.length}${pageCount > 1 ? " trên trang này" : ""}`, margin, pageHeight - 34);

    return canvas;
}

function normalizeWidths(widths, count) {
    if (!Array.isArray(widths) || widths.length !== count) {
        return Array(count).fill(1 / count);
    }
    const total = widths.reduce((sum, value) => sum + Number(value || 0), 0);
    if (!total) return Array(count).fill(1 / count);
    return widths.map(value => Number(value || 0) / total);
}

function fitText(ctx, value, maxWidth) {
    const text = String(value ?? "-");
    if (ctx.measureText(text).width <= maxWidth) return text;
    let shortened = text;
    while (shortened.length > 1 && ctx.measureText(`${shortened}...`).width > maxWidth) {
        shortened = shortened.slice(0, -1);
    }
    return `${shortened}...`;
}

function canvasToJpegBlob(canvas) {
    return new Promise((resolve, reject) => {
        canvas.toBlob(blob => {
            if (blob) resolve(blob);
            else reject(new Error("Không thể tạo ảnh cho báo cáo PDF."));
        }, "image/jpeg", 0.92);
    });
}

function buildImagePdf(pageImages, imageWidth, imageHeight) {
    const encoder = new TextEncoder();
    const ascii = value => encoder.encode(value);
    const concatBytes = parts => {
        const length = parts.reduce((total, part) => total + part.length, 0);
        const result = new Uint8Array(length);
        let offset = 0;
        parts.forEach(part => {
            result.set(part, offset);
            offset += part.length;
        });
        return result;
    };
    const objectCount = 2 + pageImages.length * 3;
    const objects = new Array(objectCount + 1);
    const pageIds = pageImages.map((_, index) => 3 + index * 3);

    objects[1] = ascii("<< /Type /Catalog /Pages 2 0 R >>");
    objects[2] = ascii(`<< /Type /Pages /Kids [${pageIds.map(id => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`);

    pageImages.forEach((image, index) => {
        const pageId = 3 + index * 3;
        const imageId = pageId + 1;
        const contentId = pageId + 2;
        const imageName = `Im${index + 1}`;
        const content = ascii(`q\n842 0 0 595 0 0 cm\n/${imageName} Do\nQ`);

        objects[pageId] = ascii(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 842 595] /Resources << /XObject << /${imageName} ${imageId} 0 R >> >> /Contents ${contentId} 0 R >>`);
        objects[imageId] = concatBytes([
            ascii(`<< /Type /XObject /Subtype /Image /Width ${imageWidth} /Height ${imageHeight} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${image.length} >>\nstream\n`),
            image,
            ascii("\nendstream"),
        ]);
        objects[contentId] = concatBytes([
            ascii(`<< /Length ${content.length} >>\nstream\n`),
            content,
            ascii("\nendstream"),
        ]);
    });

    const parts = [ascii("%PDF-1.4\n")];
    const offsets = [0];
    let currentOffset = parts[0].length;

    for (let id = 1; id <= objectCount; id++) {
        offsets[id] = currentOffset;
        const object = concatBytes([ascii(`${id} 0 obj\n`), objects[id], ascii("\nendobj\n")]);
        parts.push(object);
        currentOffset += object.length;
    }

    const xrefOffset = currentOffset;
    const xref = offsets.slice(1).map(offset => `${String(offset).padStart(10, "0")} 00000 n \n`).join("");
    parts.push(ascii(`xref\n0 ${objectCount + 1}\n0000000000 65535 f \n${xref}trailer\n<< /Size ${objectCount + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`));
    return new Blob(parts, { type: "application/pdf" });
}
