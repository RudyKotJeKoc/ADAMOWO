# Eliciting Requirements from Ambiguous User Requests

Transforming a vague user request like "optimize the code and add new features. make sure the code is complete" into an actionable software development plan requires a structured approach to requirements elicitation [ref: 0-0, ref: 0-2]. Requirements elicitation is the process of researching, gathering, and defining a system's requirements from users, clients, and other stakeholders [ref: 0-0]. This process is critical for establishing a clear project scope, avoiding misunderstandings, and ensuring the final product aligns with business objectives [ref: 0-2, ref: 0-3].

## A Formal Process for Requirements Elicitation

A systematic approach to elicitation involves several distinct stages, moving from high-level goals to detailed specifications [ref: 0-3]. The process is often iterative, involving continuous refinement based on stakeholder feedback [ref: 0-0].

### Stage 1: Preparation and Stakeholder Identification
The first step is to identify all key stakeholders—the individuals or groups who will use, develop, or be impacted by the project [ref: 0-0]. This can include end-users, customers, project managers, and developers [ref: 0-0]. Analyzing stakeholder roles, for instance with a RACI (Responsible, Accountable, Consulted, Inform) matrix, helps to engage the right people and streamline communication [ref: 0-2]. During preparation, the business analyst should also collect and analyze existing documentation, such as business rules, technical manuals of existing systems, and competitor analyses, to understand the business context [ref: 0-2].

### Stage 2: Gathering Requirements (Elicitation)
Once stakeholders are identified, the process of gathering their needs begins [ref: 0-0]. It is generally accepted that using a variety of techniques is more effective than relying on a single method [ref: 0-1]. Common elicitation techniques include:
*   **Interviews**: A traditional method to collect data quickly. Interviews can be unstructured (conversational) or structured (using a predetermined set of questions) [ref: 0-1].
*   **Surveys and Questionnaires**: An efficient way to collect information from a large number of stakeholders at once, especially in the early stages [ref: 0-1, ref: 0-2].
*   **Workshops and Group Sessions**: Collaborative meetings like Brainstorming, Joint Application Development (JAD), and Facilitated Application Specification Technique (FAST) are used to generate ideas, bridge expectation gaps, and make decisions rapidly [ref: 0-0, ref: 0-1].
*   **Observation (Ethnography)**: Involves observing users in their natural work environment to understand existing processes and contextual factors [ref: 0-1].
*   **Prototyping**: Providing stakeholders with early models of the system (e.g., wireframes, mockups, or executable prototypes) is an effective way to gather detailed feedback and clarify requirements, especially when users are unfamiliar with potential solutions [ref: 0-1, ref: 0-4].
*   **Document and Interface Analysis**: Examining existing documentation, forms, reports, and system interfaces helps gather domain knowledge and identify requirements for replacement or enhancement projects [ref: 0-1, ref: 0-2].

### Stage 3: Analysis, Definition, and Prioritization
After gathering information, the requirements must be analyzed to ensure they are complete, feasible, and consistent [ref: 0-3]. This stage involves categorizing requirements into distinct types [ref: 0-3]:
*   **Functional Requirements**: Define what a product must do, its features, and its functions [ref: 0-4].
*   **Non-Functional Requirements (NFRs)**: Describe *how* a system should perform, covering quality attributes like performance, security, and usability [ref: 0-4, ref: 0-3].

Since resources are often limited, requirements must be prioritized [ref: 0-0]. Prioritization techniques help the team focus on the most critical features first [ref: 0-3]. Common methods include:
*   **MoSCoW Method**: Categorizes requirements as Must-have, Should-have, Could-have, or Won't-have [ref: 0-3, ref: 0-0].
*   **Kano Analysis**: Rates requirements based on their ability to satisfy customers [ref: 0-3].
*   **Hundred Dollar Method**: Stakeholders allocate a hypothetical $100 among requirements to indicate relative importance [ref: 0-3].

### Stage 4: Documentation and Validation
The elicited requirements are documented in a Software Requirements Specification (SRS) or Product Requirements Document (PRD) [ref: 0-3]. This documentation must be clear, specific, testable, and understandable to all stakeholders [ref: 0-4]. Two common formats for capturing requirements are:
*   **Use Cases**: Describe the interaction between a user (actor) and the system to achieve a specific goal [ref: 0-4]. They are represented through diagrams and detailed specifications [ref: 0-4].
*   **User Stories**: A short, simple description of a feature from the perspective of the end-user, following the format: "As a <type of user>, I want <some goal> so that <some reason>" [ref: 0-4].

Finally, requirements must be validated with stakeholders to ensure they accurately represent their needs [ref: 0-0]. Prototyping and unit testing are key activities in this phase to test and measure each specific part of the documented requirements [ref: 0-3].

## Structured Questions to Deconstruct an Ambiguous Request

To clarify a vague request, a developer or business analyst can use structured questions categorized by each part of the user's prompt.

### Deconstructing "Optimize the Code" (Non-Functional Requirements)

This part of the request relates to non-functional requirements (NFRs), which define system qualities and performance attributes [ref: 0-4]. The goal is to transform subjective terms like "optimize" into measurable targets.

| Category | Question | Purpose |
|---|---|---|
| **Performance** | "When you say 'optimize,' what specific aspect of performance are we improving (e.g., page load time, data processing speed, application response time)?" | To identify the specific performance metric of concern. |
| **Performance** | "What is the current performance, and what is the target performance we need to achieve (e.g., reduce page load from 5 seconds to under 2 seconds)?" | To quantify the goal and make it testable [ref: 0-4]. |
| **Scalability** | "Under what conditions should this performance be maintained? For example, how many simultaneous users should the system support without degradation?" | To define performance constraints and scalability needs [ref: 0-4]. |
| **Reliability** | "Are there concerns about system stability or uptime? What level of availability is expected (e.g., 99.9% uptime)?" | To clarify reliability and availability requirements. |
| **Security** | "Does 'optimize' also include security improvements, such as protecting against unauthorized access?" | To uncover potential security-related NFRs [ref: 0-0]. |

### Deconstructing "Add New Features" (Functional Requirements)

This part of the request relates to functional requirements, which describe what the system should do [ref: 0-4]. User stories are an excellent format for defining these features [ref: 0-4].

| Category | Question | Purpose |
|---|---|---|
| **User & Goal** | "Who is this new feature for? Can you describe the type of user who will benefit from it?" | To identify the 'As a <user>' part of a user story [ref: 0-4]. |
| **Functionality** | "What specific task does this user need to accomplish with this new feature?" | To define the 'I want <to do something>' part of a user story [ref: 0-4]. |
| **Value** | "What is the ultimate benefit for the user or the business once this feature is implemented?" | To understand the 'so that <I get some value>' part of a user story [ref: 0-4]. |
| **Process** | "Can you walk me through the step-by-step process of how a user would interact with this feature?" | To help create use cases and uncover detailed interaction steps [ref: 0-4]. |
| **Business Rules** | "Are there any specific rules, constraints, or conditions that apply to this feature?" | To capture underlying business logic and constraints [ref: 0-2]. |

### Deconstructing "Make it Complete" (Scope and Definition of Done)

This phrase addresses the project's scope, priorities, and the user's definition of success [ref: 0-2, ref: 0-3]. Clarifying this is crucial to prevent scope creep and ensure stakeholder satisfaction [ref: 0-2].

| Category | Question | Purpose |
|---|---|---|
| **Business Objective** | "What is the primary business problem we are trying to solve with this project? What does a 'complete' solution look like from a business perspective?" | To align the project with high-level business goals [ref: 0-3, ref: 0-4]. |
| **Prioritization** | "To deliver value quickly, what are the absolute 'must-have' features for the first version? What can be considered 'should-have' or 'could-have' for later?" | To prioritize features (e.g., using MoSCoW) and define a realistic scope for the initial release [ref: 0-3]. |
| **Acceptance Criteria** | "How will we know the feature or project is successfully completed? What specific conditions must be met for you to accept it?" | To define testable acceptance criteria for each requirement [ref: 0-4]. |
| **Definition of Done** | "What is your definition of 'complete'? Does it mean all features from a previous system are included, or does it mean a specific set of new functionalities are working?" | To establish a shared understanding of the project's final state and deliverables [ref: 0-2]. |
| **Transition** | "What is needed for the organization to transition to this new 'complete' system? For example, does data need to be migrated or do users need training?" | To identify transition requirements necessary for a successful rollout [ref: 0-4]. |

## Communication and Expectation Management Best Practices

Effective communication is central to the elicitation process, ensuring that developers build what the customer actually needs [ref: 0-0, ref: 0-2].

*   **Establish a Shared Vision**: The primary goal is to bridge the "expectation gap" between what developers think they should build and what customers expect to get [ref: 0-0]. This avoids confusion and saves development time [ref: 0-2].
*   **Use Visual Aids**: Prototypes, wireframes, and diagrams are powerful tools for visualizing requirements [ref: 0-4]. They allow stakeholders to see and interact with a representation of the final product, which helps in identifying gaps and providing concrete feedback [ref: 0-1, ref: 0-4].
*   **Maintain Clear Documentation**: A well-documented SRS serves as a formal agreement and a single source of truth for all stakeholders [ref: 0-4, ref: 0-3]. Requirements should be clear, concise, specific, and testable [ref: 0-4].
*   **Practice Active Facilitation**: The business analyst or developer must guide elicitation meetings, manage conflicting requirements from different stakeholders, and keep discussions focused on defining *what* the system should do, not *how* it should be implemented [ref: 0-2, ref: 0-1].
*   **Embrace an Iterative Process**: Requirements elicitation is not a one-time phase but an iterative cycle of gathering, refining, and validating information based on continuous stakeholder feedback [ref: 0-0].