/* eslint-disable react/prop-types */
import { useEffect } from 'react';
import { PlusCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

const Modal = ({ modalId, title, description, children, triggerButtonLabel, triggerButtonClass, onClose }) => {
    useEffect(() => {
        const dialog = document.getElementById(modalId);
        const handleClose = () => {
            if (onClose) {
                onClose();
            }
        };
        dialog.addEventListener('close', handleClose);

        return () => {
            dialog.removeEventListener('close', handleClose);
        };
    }, [modalId, onClose]);

    return (
        <>
            <button
                className={`btn ${triggerButtonClass} flex flex-col justify-center rounded-2xl`}
                onClick={() => document.getElementById(modalId).showModal()}
            >
                <PlusCircleIcon className="w-10" />
                <span>{triggerButtonLabel}</span>
            </button>
            <dialog id={modalId} className="modal">
                <div className="modal-box bg-base-200 border border-2 border-black shadow-2xl shadow-white/40">
                    <div className="text-center my-10 space-y-1">
                        <h2 className="font-bold text-3xl">{title}</h2>
                        <p className="text-base-content/70 text-sm">{description}</p>
                    </div>
                    {children}
                    <div className="modal-action">
                        <form method="dialog" className="absolute top-5 left-0">
                            <button className=""><XMarkIcon className="w-6" /></button>
                        </form>
                    </div>
                </div>
            </dialog>
        </>
    );
};

export default Modal;
