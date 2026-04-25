# Security Specification: STEM Rafiki

## Data Invariants
1. **User Identity Isolation**: A user can only read and write their own profile document (`/users/{uid}`).
2. **Conversation Access**: Conversations belong to a specific `studentId`. Only that student can read/write the conversation and its messages.
3. **Collaboration Logic**: A project can only be accessed by its owner or registered collaborators.
4. **Quiz Integrity**: Quizzes are read-only for students (global resource).
5. **XP/Level Protection**: Users cannot arbitrarily increment their own XP (in a real production app, this would be server-side, but here we will enforce that only the owner can update their profile, though we can't fully prevent client-side XP cheating without cloud functions or strict rules).

## The Dirty Dozen Payloads

1. **Identity Spoofing**: `PATCH /users/victim-id` with `{"name": "Attacker"}` from Attacker's account.
2. **Accessing Private Chats**: `GET /conversations/private-conv-id` from a different student.
3. **Message Injection**: `POST /conversations/victim-conv-id/messages` from a different student.
4. **Shadow Field Injection**: `POST /users/{myUid}` with `{"isAdmin": true}`.
5. **Project Takeover**: `PATCH /projects/{projId}` with `{"ownerId": "attackerId"}`.
6. **Quiz Modification**: `PATCH /quizzes/{quizId}` from a student account.
7. **Orphaned Message**: `POST /conversations/non-existent-conv/messages`.
8. **Resource Exhaustion**: `POST /users/{uid}` with a 1MB string in `name`.
9. **State Shortcutting**: `PATCH /conversations/{id}` updating `updatedAt` to a future date.
10. **ID Poisoning**: `POST /users/!!!bad-id!!!`.
11. **Collaboration Bypass**: `GET /projects/{projId}` for a project you aren't assigned to.
12. **PII Leak**: `GET /users/{userId}` as a non-owner to extract email.

## Test Runner (Simplified Concept)
(The actual test file `firestore.rules.test.ts` should be created if needed, but I'll focus on the rules first.)
