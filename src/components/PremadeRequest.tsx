
import React from 'react'
import { RequestCreation } from "../backend/request_backend"
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import RequestCreator from './RequestCreator'

type Props = {
  requestCreation: RequestCreation,
  buttonVariant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost",
  buttonText?: string,
  className?: string,
  open?: boolean
  button?: boolean
  onOpenChange?: (open: boolean) => void
}

const PremadeRequest = ({ requestCreation, buttonVariant, buttonText, className, open, button, onOpenChange }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger>
        {button && <Button variant={buttonVariant} className={className}>{buttonText}</Button>}
      </DialogTrigger>
      <DialogContent>
        <RequestCreator defaultValues={requestCreation} />
      </DialogContent>
    </Dialog>
  )
}

export default PremadeRequest
