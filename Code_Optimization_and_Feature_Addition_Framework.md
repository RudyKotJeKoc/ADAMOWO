# Research Framework

- **Component 1: Deconstructing the User's Vague Request:** The initial request "optimize the code and add new features. make sure the code is complete" is a task command, not a research query. It lacks the essential context for execution. This component focuses on identifying the critical missing information needed to proceed.
    - **Knowledge to acquire:** A structured list of clarifying questions for the user is needed. This includes obtaining the code itself, its programming language, its primary purpose, specific optimization goals (e.g., improve speed, reduce memory usage), a description of the desired new features, and the user's definition of "complete" (e.g., runnable, documented, tested).
    - **Sources needed:** While primarily an analytical step, research into "requirements elicitation" and "client communication" in software engineering will provide formal methodologies for effectively gathering this information from the user.

- **Component 2: General-Purpose Code Optimization Strategies:** To prepare for the "optimize code" task, a broad understanding of common optimization strategies across different programming paradigms is required.
    - **Knowledge to acquire:** Language-agnostic principles (e.g., algorithmic efficiency, data structure selection, I/O reduction) and language-specific techniques (e.g., vectorization in Python, memory management in C++, concurrency models in Go).
    - **Sources needed:** Authoritative sources such as official programming language documentation (e.g., Python's performance tips), computer science academic materials on algorithms, and articles from reputable software engineering blogs and performance experts.

- **Component 3: Methodologies for Modular Feature Integration:** To address the "add new features" request, it is crucial to understand how to extend software in a clean, maintainable, and scalable way without introducing bugs or technical debt.
    - **Knowledge to acquire:** Principles of modular and extensible software design, such as SOLID principles, and common software design patterns (e.g., Strategy, Decorator, Factory) that facilitate adding functionality.
    - **Sources needed:** Classic software engineering texts (e.g., "Design Patterns: Elements of Reusable Object-Oriented Software"), tutorials on software architecture, and guides on modern development practices like plugin-based systems.

- **Component 4: Defining and Achieving "Code Completeness":** The term "complete" is subjective and must be translated into a set of concrete, professional standards. This component aims to establish what constitutes production-ready code.
    - **Knowledge to acquire:** Industry standards for "complete" code, which typically includes comprehensive error handling, sufficient unit and integration tests, clear documentation (in-code comments and external README files), and adherence to established coding style guides.
    - **Sources needed:** Researching popular style guides (e.g., Google's C++ Style Guide, Python's PEP 8), documentation for testing frameworks (e.g., Jest, PyTest), and articles on the "Definition of Done" concept in Agile software development.

# Search Plan

1. Investigate common performance profiling tools and methodologies for identifying bottlenecks in major programming languages like Python, JavaScript, and Java.

2. Research advanced algorithmic optimization strategies beyond basic Big O analysis, such as memoization, dynamic programming, and efficient data structure selection, with practical implementation examples.

3. Explore modern software design patterns for implementing new features in a modular and scalable way, focusing on plugin architectures and microservices principles.

4. Search for industry-standard checklists and formal definitions of "Definition of Done" in Agile software development to create a comprehensive standard for "complete code."

5. Find best practices and frameworks for writing effective unit tests, integration tests, and end-to-end tests to ensure code quality and reliability.

6. Research effective communication techniques and question frameworks for clarifying vague technical requests and eliciting specific requirements from non-technical users.