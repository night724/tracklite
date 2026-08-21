import { useEffect, useState } from "react";

export default function NewIssueShortcut() {

    const [open, setOpen] = useState(false);

    useEffect(() => {

        function handleKeyDown(event) {

            const tag =
                event.target.tagName;

            if (
                tag === "INPUT" ||
                tag === "TEXTAREA" ||
                tag === "SELECT"
            ) {
                return;
            }

            if (
                event.key.toLowerCase() === "c"
            ) {
                setOpen(true);
            }

            if (
                event.key === "Escape"
            ) {
                setOpen(false);
            }
        }

        window.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {
            window.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };

    }, []);

    if (!open) return null;

    return (
        <div className="modal-backdrop">

            <div className="modal">

                <h2>
                    Create new issue
                </h2>

                <input
                    autoFocus
                    placeholder="Issue title"
                />

                <div className="modal-actions">

                    <button
                        onClick={() =>
                            setOpen(false)
                        }
                    >
                        Cancel
                    </button>

                    <button className="primary-button">
                        Create issue
                    </button>

                </div>

            </div>

        </div>
    );
}
