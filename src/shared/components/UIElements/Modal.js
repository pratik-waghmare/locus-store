import ReactDOM from "react-dom";

import "./Modal.css";

const ModalOverlay = (props) => {
  const content = (
    <div>
      <div className="modal__backdrop" onClick={props.onCancel}></div>
      <div
        className={`modal-dialog ${props.modalClasse}`}
        style={props.style}
        role="document"
      >
        <div className="modal-content">
          <header
            className={`modal-header ${props.headerClass}`}
            style={{ backgroundColor: props.headerColor }}
          >
            <h2 className="modal-title card__heading">{props.header}</h2>
          </header>
          <form
            onSubmit={
              props.onSubmit
                ? props.onSubmit
                : (event) => event.preventDefault()
            }
          >
            <div className="modal-body">{props.children}</div>
            <footer className={`modal-footer ${props.footerClass}`}>
              {props.footer}
            </footer>
          </form>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(content, document.getElementById("modal-hook"));
};

const Modal = (props) => {
  return (
    <div className="modal" tabIndex="-1" role="dialog">
      {props.show && (
        <div>
          <ModalOverlay {...props} />
        </div>
      )}
    </div>
  );
};

export default Modal;
