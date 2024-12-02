export class WebHealthError extends Error {
  status: number

  constructor(message: string) {
    super(message)
    this.name = 'WebHealthError'
    this.status = 503
  }
}
