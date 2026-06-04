function ensureDialogStyles() {
    if (document.getElementById("app-dialog-styles")) return;

    const style = document.createElement("style");
    style.id = "app-dialog-styles";
    style.textContent = `
        .app-dialog {
            position: fixed;
            inset: 0;
            z-index: 2000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
            background: rgba(10, 37, 64, 0.48);
        }
        .app-dialog__panel {
            width: min(420px, 100%);
            background: #fff;
            border: 1px solid #e8e4dc;
            border-radius: 10px;
            box-shadow: 0 24px 70px rgba(10, 37, 64, 0.24);
            padding: 22px;
            color: #1a1a2e;
            font-family: "Roboto", Arial, sans-serif;
        }
        .app-dialog__title {
            margin: 0 0 10px;
            font-size: 20px;
            line-height: 1.25;
            font-weight: 700;
        }
        .app-dialog__message {
            margin: 0;
            color: #4b5563;
            font-size: 14px;
            line-height: 1.55;
        }
        .app-dialog__actions {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 22px;
            flex-wrap: wrap;
        }
        .app-dialog__btn {
            height: 38px;
            padding: 0 16px;
            border-radius: 7px;
            border: 1px solid #e2e2da;
            background: #fafaf8;
            color: #1a1a2e;
            font: inherit;
            font-size: 13px;
            font-weight: 700;
            cursor: pointer;
        }
        .app-dialog__btn--primary {
            border-color: transparent;
            background: linear-gradient(135deg, #c9a84c, #e8cc7a);
        }
        .app-dialog__btn--danger {
            border-color: #fecaca;
            background: #fee2e2;
            color: #991b1b;
        }
    `;
    document.head.appendChild(style);
}

export function showAppDialog({ title, message, actions = [] }) {
    ensureDialogStyles();

    const dialog = document.createElement("div");
    dialog.className = "app-dialog";
    dialog.innerHTML = `
        <section class="app-dialog__panel" role="dialog" aria-modal="true">
            <h3 class="app-dialog__title">${title}</h3>
            <p class="app-dialog__message">${message}</p>
            <div class="app-dialog__actions"></div>
        </section>
    `;

    const actionWrap = dialog.querySelector(".app-dialog__actions");
    const choices = actions.length ? actions : [{ label: "Đóng", value: "ok", primary: true }];

    return new Promise(resolve => {
        const close = (value) => {
            document.removeEventListener("keydown", handleKeydown);
            dialog.remove();
            resolve(value);
        };

        const handleKeydown = (event) => {
            if (event.key === "Escape") close(choices[choices.length - 1].value);
        };

        choices.forEach(action => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "app-dialog__btn";
            if (action.primary) button.classList.add("app-dialog__btn--primary");
            if (action.danger) button.classList.add("app-dialog__btn--danger");
            button.textContent = action.label;
            button.addEventListener("click", () => close(action.value));
            actionWrap.appendChild(button);
        });

        document.addEventListener("keydown", handleKeydown);
        document.body.appendChild(dialog);
        actionWrap.querySelector(".app-dialog__btn--primary, .app-dialog__btn")?.focus();
    });
}
