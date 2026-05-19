# Lançar.me — Domain Model

## 1. Auth & Workspace

### User

- id
- name
- email
- passwordHash
- status
- createdAt
- updatedAt

### Workspace

- id
- name
- slug
- plan
- status
- aiCreditBalance
- createdAt
- updatedAt

### WorkspaceMember

- id
- workspaceId
- userId
- role: OWNER, ADMIN, STRATEGIST, COPYWRITER, DESIGNER, TRAFFIC_MANAGER, MENTOR, VIEWER
- status
- createdAt

## 2. Strategy Core

### Product

- id
- workspaceId
- name
- description
- category
- format
- ticket
- status
- checkoutUrl
- salesPageUrl
- createdAt
- updatedAt

### Avatar

- id
- workspaceId
- productId
- name
- pains
- desires
- objections
- awarenessLevel
- languageStyle
- notes

### Offer

- id
- workspaceId
- productId
- promise
- uniqueMechanism
- deliverables
- bonuses
- price
- guarantee
- proofSummary
- objectionHandling
- status

## 3. Launch Operations

### Launch

- id
- workspaceId
- productId
- name
- type
- phase
- startDate
- endDate
- goalLeads
- goalRevenue
- budget
- channels
- status

### Task

- id
- workspaceId
- launchId
- title
- description
- phase
- dueDate
- assigneeId
- status
- priority

## 4. Content, Copy and Creative

### ContentPiece

- id
- workspaceId
- productId
- launchId
- format
- phase
- title
- body
- status
- sourceType
- aiGenerated

### CopyDocument

- id
- workspaceId
- productId
- launchId
- type
- title
- body
- version
- score
- status
- aiGenerated

### CreativeBrief

- id
- workspaceId
- productId
- launchId
- copyDocumentId
- angle
- format
- funnelStage
- hook
- instructions
- status

## 5. Traffic and Funnel

### TrafficPlan

- id
- workspaceId
- launchId
- channel
- budget
- campaignStructure
- audiences
- utmPattern
- trackingChecklist
- status

### FunnelNode

- id
- workspaceId
- launchId
- type
- title
- url
- position
- status
- notes

### MetricSnapshot

- id
- workspaceId
- launchId
- date
- leads
- cpl
- cpc
- cpm
- ctr
- conversions
- sales
- revenue
- spend
- roas

## 6. MentorFlow and Proof Vault

### StudentOrClient

- id
- workspaceId
- productId
- name
- email
- phone
- status
- progressStatus
- notes

### MentorshipSession

- id
- workspaceId
- studentOrClientId
- date
- summary
- nextActions
- status

### ProofItem

- id
- workspaceId
- productId
- launchId
- studentOrClientId
- type
- title
- content
- fileAssetId
- authorizationStatus
- usageScope
- tags

## 7. AI and Billing

### AiActionLog

- id
- workspaceId
- userId
- module
- action
- provider
- model
- promptVersion
- inputTokenEstimate
- outputTokenEstimate
- creditsCharged
- status
- errorCode
- latencyMs
- createdAt

### AiCreditLedger

- id
- workspaceId
- userId
- type
- amount
- balanceAfter
- source
- relatedActionLogId
- expiresAt
- createdAt

### Subscription

- id
- workspaceId
- provider
- providerCustomerId
- providerSubscriptionId
- plan
- status
- currentPeriodStart
- currentPeriodEnd

### PaymentEvent

- id
- workspaceId
- provider
- eventId
- type
- status
- payloadHash
- processedAt
- createdAt

## 8. Files and Audit

### FileAsset

- id
- workspaceId
- ownerId
- module
- entityType
- entityId
- originalName
- storageKey
- mimeType
- sizeBytes
- visibility
- createdAt

### AuditLog

- id
- workspaceId
- userId
- action
- entityType
- entityId
- metadata
- ipAddress
- userAgent
- createdAt
