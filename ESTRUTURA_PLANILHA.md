# Estrutura da Planilha

## Abas

- `VisitRequests`
- `VisitParticipants`
- `AvailabilitySlots`
- `Hosts`
- `EmailLogs`
- `AuditLogs`
- `Settings`
- `Checkins`
- `VisitorQuestions`

## VisitRequests

`RequestID`, `CreatedAt`, `Status`, `VisitorName`, `VisitorEmail`, `VisitorPhone`, `Organization`, `VisitType`, `Mode`, `VisitorsCount`, `SlotID`, `Unit`, `Area`, `HostID`, `SafetyAccepted`, `QuizScore`, `QrToken`, `CheckinURL`, `EmailVisitorSent`, `EmailHostSent`, `EmailAdminSent`, `LastEmailAt`, `Notes`, `CheckinAt`, `CheckoutAt`.

## VisitParticipants

`ParticipantID`, `RequestID`, `Name`, `Document`, `Organization`, `Notes`.

## AvailabilitySlots

`SlotID`, `Date`, `Time`, `Unit`, `Area`, `TypeAllowed`, `CapacityTotal`, `CapacityUsed`, `CapacityAvailable`, `Status`, `CreatedAt`, `UpdatedAt`.

## Hosts

`HostID`, `Name`, `Email`, `Phone`, `Area`, `Active`, `CreatedAt`, `UpdatedAt`.

## VisitorQuestions

`QuestionID`, `CreatedAt`, `RequestCode`, `Name`, `Email`, `Phone`, `Topic`, `Message`, `Status`, `Answer`, `AnsweredAt`.

## EmailLogs

`EmailLogID`, `CreatedAt`, `EntityType`, `EntityID`, `Recipient`, `Subject`, `Status`, `Error`.

## AuditLogs

`AuditID`, `CreatedAt`, `Actor`, `Action`, `EntityType`, `EntityID`, `PreviousStatus`, `NewStatus`, `Details`.

## Checkins

`CheckinID`, `RequestID`, `QrToken`, `StatusBefore`, `StatusAfter`, `CheckinAt`, `CheckoutAt`, `RegisteredBy`, `Notes`.

## Settings

`Key`, `Value`, `Description`, `UpdatedAt`.
