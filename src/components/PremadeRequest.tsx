
import React from 'react'
import { RequestCreation } from "../backend/request_backend"
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import RequestCreator from './RequestCreator'

type Props = {
  requestCreation: RequestCreation,
  buttonVariant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost",
  buttonText: string,
  className?: string
}

const PremadeRequest = ({ requestCreation, buttonVariant, buttonText, className }: Props) => {
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant={buttonVariant} className={className}>{buttonText}</Button>
      </DialogTrigger>
      <DialogContent>
        <RequestCreator />
      </DialogContent>
    </Dialog>
  )
}

export default PremadeRequest
