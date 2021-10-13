import {
  Approval as ApprovalEvent,
  ApprovalForAll as ApprovalForAllEvent,
  FoundationAddressUpdated as FoundationAddressUpdatedEvent,
  MemberAdded as MemberAddedEvent,
  MemberRevoked as MemberRevokedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  Transfer as TransferEvent
} from "../generated/BlankArt/BlankArt"
import {
  Approval,
  ApprovalForAll,
  FoundationAddressUpdated,
  MemberAdded,
  MemberRevoked,
  OwnershipTransferred,
  Transfer
} from "../generated/schema"

export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.owner = event.params.owner
  entity.approved = event.params.approved
  entity.tokenId = event.params.tokenId
  entity.save()
}

export function handleApprovalForAll(event: ApprovalForAllEvent): void {
  let entity = new ApprovalForAll(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.owner = event.params.owner
  entity.operator = event.params.operator
  entity.approved = event.params.approved
  entity.save()
}

export function handleFoundationAddressUpdated(
  event: FoundationAddressUpdatedEvent
): void {
  let entity = new FoundationAddressUpdated(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.foundationAddress = event.params.foundationAddress
  entity.save()
}

export function handleMemberAdded(event: MemberAddedEvent): void {
  let entity = new MemberAdded(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.member = event.params.member
  entity.save()
}

export function handleMemberRevoked(event: MemberRevokedEvent): void {
  let entity = new MemberRevoked(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.member = event.params.member
  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner
  entity.save()
}

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.tokenId = event.params.tokenId
  entity.save()
}
