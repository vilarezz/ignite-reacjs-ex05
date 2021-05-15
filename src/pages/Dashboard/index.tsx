import { useEffect, useState } from 'react'

import api from '../../services/api'

import { Food as FoodContainer } from '../../components/Food'
import { Header } from '../../components/Header'
import { ModalAddFood } from '../../components/ModalAddFood'
import { ModalEditFood } from '../../components/ModalEditFood'

import { FoodsType } from '../../types'
import { FoodsContainer } from './styles'

type EditFoods = Omit<FoodsType, 'available'>

export function Dashboard() {
  const [foods, setFoods] = useState<FoodsType[]>([])
  const [editingFood, setEditingFood] = useState<EditFoods>({} as EditFoods)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  useEffect(() => {
    async function load() {
      const response = await api.get('/foods')

      setFoods(response.data)
    }

    load()
  }, [])

  async function handleAddFood(food: FoodsType) {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true
      })

      setFoods([...foods, response.data])
    } catch (err) {
      console.log(err)
    }
  }

  async function handleUpdateFood(food: EditFoods) {
    try {
      const foodUpdated = await api.put(`/foods/${editingFood.id}`, {
        ...editingFood,
        ...food
      })

      const foodsUpdated = foods.map(food =>
        food.id !== foodUpdated.data.id ? food : foodUpdated.data
      )

      setFoods(foodsUpdated)
    } catch (err) {
      console.log(err)
    }
  }

  async function handleDeleteFood(id: number) {
    await api.delete(`/foods/${id}`)

    const foodsFiltered = foods.filter(food => food.id !== id)
    setFoods(foodsFiltered)
  }

  function handleToggleModel() {
    setIsModalOpen(!isModalOpen)
  }

  function handleToggleEditModal() {
    setIsEditModalOpen(!isEditModalOpen)
  }

  function handleEditFood(food: FoodsType) {
    setEditingFood(food)
    setIsEditModalOpen(true)
  }

  return (
    <>
      <Header openModal={handleToggleModel} />
      <ModalAddFood
        isOpen={isModalOpen}
        setIsOpen={handleToggleModel}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={isEditModalOpen}
        setIsOpen={handleToggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <FoodContainer
              key={food.id}
              food={food}
              handleDelete={() => handleDeleteFood(food.id)}
              handleEditFood={() => handleEditFood(food)}
            />
          ))}
      </FoodsContainer>
    </>
  )
}
