import { useRef } from 'react'
import { FiCheckSquare } from 'react-icons/fi'

import { Modal } from '../Modal'
import { Input } from '../Input'

import { FoodsType } from '../../types'
import { Form } from './styles'

type Food = Omit<FoodsType, 'available'>

interface ModalEditFoodProps {
  isOpen: boolean
  setIsOpen: () => void
  editingFood: Food
  handleUpdateFood: (food: FoodsType) => Promise<void>
}

export function ModalEditFood({
  isOpen,
  setIsOpen,
  editingFood,
  handleUpdateFood
}: ModalEditFoodProps) {
  const formRef = useRef(null)

  async function handleSubmit(data: FoodsType): Promise<void> {
    handleUpdateFood(data)
    setIsOpen()
  }

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Form ref={formRef} onSubmit={handleSubmit} initialData={editingFood}>
        <h1>Editar Prato</h1>
        <Input name="image" placeholder="Cole o link aqui" />

        <Input name="name" placeholder="Ex: Moda Italiana" />
        <Input name="price" placeholder="Ex: 19.90" />

        <Input name="description" placeholder="Descrição" />

        <button type="submit" data-testid="edit-food-button">
          <div className="text">Editar Prato</div>
          <div className="icon">
            <FiCheckSquare size={24} />
          </div>
        </button>
      </Form>
    </Modal>
  )
}
