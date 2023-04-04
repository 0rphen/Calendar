export type Type = 'info' | 'warning' | 'error'

export default interface INotification {
  hasVisible: boolean
  type?: Type
  icon?: boolean
  text: string
  close?: boolean
}
