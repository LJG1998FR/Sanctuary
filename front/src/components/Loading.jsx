import { useTranslation } from "../hooks/useTranslations";


export default function Loading() {
    const { t } = useTranslation();
    return (<div id="spinner" className="d-flex justify-content-center align-items-center">
        <div className="spinner-border" role="status">
            <span className="visually-hidden">{ t('common.messages.loading') }</span>
        </div>
    </div>
    );
}