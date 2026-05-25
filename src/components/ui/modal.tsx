import { Modal, Button, type ModalRootProps } from "@heroui/react"

type ModalType = ModalRootProps

export function HeroModal({ children }: ModalType) {
  return (
    <Modal>
      <Button>Open Modal</Button>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Icon />
              <Modal.Heading />
            </Modal.Header>
            <Modal.Body>{children}</Modal.Body>
            <Modal.Footer />
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  )
}
