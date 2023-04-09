export type Type = 'info' | 'warning' | 'error'

export interface INotification {
  hasVisible: boolean
  type?: Type
  icon?: boolean
  text: string
  close?: boolean
}
