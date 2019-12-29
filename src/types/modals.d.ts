export declare global {
    interface ModalButton {
        callback?: () => void;
        label: string;
        color?: "white" | "light" | "dark" | "black" | "primary" | "info" | "success" | "warning" | "danger";
        isCancel?: boolean;
    }
}