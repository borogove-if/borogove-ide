export declare global {
    interface Tab {
        closable: boolean;
        component: ReactComponent;
        id: string;
        index?: number;
        isActive?: boolean;
        label: string;
        type: TabContentType;
    }

    interface EditorTabOptions {
        code: string;
    }

    type AllTabOptions = EditorTabOptions;
}