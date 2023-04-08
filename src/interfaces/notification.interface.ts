export type Type = 'info' | 'warning' | 'error'

export default interface INotification {
  type?: Type
  icon?: boolean
  text: string
  close?: boolean
}
