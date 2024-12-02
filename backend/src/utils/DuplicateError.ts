export class DuplicateError extends Error {
  status: number

  constructor(message: string) {
    super(message)
    this.name = 'DuplicateError'
    this.status = 409
  }
}
