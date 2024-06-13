import * as React from "react";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// eslint-disable-next-line react/prop-types
export default function PopupModals({
  open,
  onDialogClose,
  children,
  isCloseBtn = false,
  className
}) {
  return (
    <div>
      <Dialog
        className={className}
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={(e, reason) => {
          if (reason === "backdropClick" || reason === "escapeKeyDown") {
            return;
          } else {
            return onDialogClose(false);
          }
        }}
        aria-describedby="alert-dialog-slide-description"
      >
        <div className="modal-content">
          {isCloseBtn && (
            <div className="modal-header" style={{ textAlign: "end" }}>
              <button
                type="button"
                className="btn-close"
                onClick={() => onDialogClose(false)}
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                X
              </button>
            </div>
          )}
          {children}
        </div>
      </Dialog>
    </div>
  );
}
