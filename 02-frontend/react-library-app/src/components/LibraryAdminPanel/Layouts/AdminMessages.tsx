import React, { useState } from "react";
import Message from "../../../models/Message";
import { useTranslation } from "react-i18next";

// Props interface with handleSubmitResponse typed as any
interface AdminMessageProps {
  message: Message;
  handleSubmitResponse: any;
}

export const AdminMessages: React.FC<AdminMessageProps> = ({ message, handleSubmitResponse }) => {
  const [showWarning, setShowWarning] = useState(false);
  const [showAnswer, setShowAnswer] = useState("");
  const { t } = useTranslation();

  // Internal submit handler
  const onSubmitResponse = () => {
    if (message.id !== null && showAnswer.trim() !== "") {
      handleSubmitResponse(message.id, showAnswer);
      setShowWarning(false);
    } else {
      setShowWarning(true);
    }
  };

  return (
    <div className="mb-4">
      <div
        className="card shadow-sm p-4 rounded-4 border-0"
        style={{ backgroundColor: "#f9f9fb" }}
      >
        <h5 className="fw text-primary">
          📘 {t("adminMessage.case")}
          <span className="text-muted">({message.id})</span>:
          <span className="text-dark"> {message.subject}</span>
        </h5>

        <p className="text-muted small mb-2">{message.userEmail}</p>
        <p className="mb-3">❓: {message.inquiry}</p>

        <hr />

        <div>
          <h6 className="fw-semibold text-secondary mb-3">
            📝 {t("adminMessage.responseLabel")}
          </h6>

          <form action="PUT">
            {showWarning && (
              <div
                className="alert alert-warning py-2 px-3 rounded-3"
                role="alert"
              >
                {t("adminMessage.warningEmptyFields")}
              </div>
            )}

            <div className="mb-3">
              <textarea
                className="form-control border-primary-subtle shadow-sm"
                id="sampleFormControlTextarea1"
                rows={4}
                placeholder={t("adminMessage.responsePlaceholder")}
                onChange={(e) => setShowAnswer(e.target.value)}
                value={showAnswer}
              />
            </div>

            <div className="mt-3">
              <button
                className="btn btn-primary px-2 py-1 invert-hover"
                type="button"
                onClick={onSubmitResponse}
              >
                {t("adminMessage.submitBtn")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
