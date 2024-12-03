export class EconnRefusedError extends Error {
  status: number

  constructor(message: string) {
    super(message)
    this.name = 'EconnRefusedError'
    this.status = 503
  }
}
