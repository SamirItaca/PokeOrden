import { prisma } from '../../prisma/cliente'
import bcrypt from 'bcrypt'
import { EditUserDTO, RegisterUserDTO, ChangePasswordDTO  } from './user.type';

// Obtener usuario para ver mi perfil
export const getUserById = async (id: number) => {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      teams: true,
      battlesP1: true,
      battlesP2: true,
      pokedex: true
    }
  })
}

// Crear un usuario
export const createUser = async (user: RegisterUserDTO) => {
  try {
    // Validación previa opcional
    if (await existsUsername(user.username)) {
      throw new Error("Username already exists")
    }

    if (await existsEmail(user.email)) {
      throw new Error("Email already exists")
    }

    const hashedPassword = await bcrypt.hash(user.password, 10)

    return await prisma.user.create({
      data: {
        username: user.username,
        email: user.email,
        password: hashedPassword,
      },
    })

  } catch (error: any) {
    // Seguridad extra contra race condition
    if (error.code === "P2002") {
      throw new Error("Username or email already exists")
    }
    throw error
  }
}

// Editar un usuario
export const editUser = async (data: EditUserDTO) => {
  const user = await prisma.user.findUnique({
    where: { id: data.id }
  })

  if (!user) {
    throw new Error("User not found")
  }

  // Verificar username si cambió
  if (data.newUsername !== user.username) {
    if (await existsUsername(data.newUsername)) {
      throw new Error("Username already exists")
    }
  }

  // Verificar email si cambió
  if (data.newEmail !== user.email) {
    if (await existsEmail(data.newEmail)) {
      throw new Error("Email already exists")
    }
  }

  return await prisma.user.update({
    where: { id: data.id },
    data: {
      username: data.newUsername,
      email: data.newEmail,
    },
  })
}

// Cambiar contraseña de un usuario
export const changePassword = async (data: ChangePasswordDTO) => {
  const user = await prisma.user.findUnique({
    where: { id: data.id }
  })

  if (!user) {
    throw new Error("User not found")
  }

  const passwordMatch = await bcrypt.compare(
    data.password,
    user.password
  )

  if (!passwordMatch) {
    throw new Error("Current password is incorrect")
  }

  const hashedNewPassword = await bcrypt.hash(data.newPassword, 10)

  return await prisma.user.update({
    where: { id: data.id },
    data: {
      password: hashedNewPassword
    }
  })
}

// Obtener pokedex de un usuario
export const getUserPokedex = async (userId: number) => {
  return await prisma.userPokedex.findMany({
    where: { userId },
    include: {
      pokemon: true
    }
  })
}

// Saber si existe el Username en un usuario
export const existsUsername = async (username: string) => {
  const user = await prisma.user.findUnique({
    where: { username }
  })
  return !!user
}

// Saber si existe el Email en un usuario
export const existsEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email }
  })
  return !!user
}