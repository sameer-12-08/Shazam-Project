
# Combined Abstract

**Project Title:** Seamless Transfer & Integrated Prompt Refiner

---

### Part 1: Seamless Transfer - A Secure, Ephemeral File Transfer System

Modern peer-to-peer (P2P) file sharing services like Quick Share often exhibit unreliability in complex network environments, such as university campuses where devices may be on external networks or hotspots. Concurrently, using persistent, account-based messaging applications for file transfer on public or shared devices introduces significant security and privacy risks. This project, "Seamless Transfer," presents a robust solution by developing a secure, ephemeral, and platform-agnostic file transfer system. The system employs a client-server architecture, featuring a Java Spring Boot backend and a React frontend. The backend handles file uploads and generates unique, time-sensitive download links, while the frontend provides a modern, intuitive user interface.

By presenting the download link as a scannable QR code, the system bypasses the complexities of P2P network discovery and eliminates the need for user accounts, ensuring both reliability and anonymity. The design emphasizes Object-Oriented principles, including the encapsulation of transfer sessions and the abstraction of storage services, to create a maintainable and scalable application. The result is a practical and user-friendly utility that provides a seamless file transfer experience across any device with a web browser and camera, effectively addressing the identified real-world problems of convenience and security.

---

### Part 2: Prompt Refiner - An Integrated AI-Assistive Tool

In the age of generative artificial intelligence, the effectiveness of large language models (LLMs) is critically dependent on the quality of user-provided prompts. The practice of "prompt engineering" is often a manual, iterative task that presents a high barrier to entry for casual users. To address this, the "Prompt Refiner" project is integrated as a new feature within the "Seamless Transfer" web application. This tool is designed to function as an intelligent assistant, helping users formulate more effective and well-structured prompts. It enhances the utility of the core application by introducing a practical AI-assistive component.

The feature is implemented with a new, dedicated React component in the frontend, providing a simple user interface for text input. This component communicates with a new REST endpoint added to the existing Java Spring Boot backend. The backend contains the core logic, which analyzes the user's raw text and applies a series of programmatic rules to enhance its clarity, context, and specificity. The refined prompt is then returned to the user. This project not only demonstrates the extensibility of the primary application but also serves as a practical exploration of applying software engineering to improve human-AI interaction.
