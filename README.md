# ScribeAI

## Long-Session Scalability

ScribeAI is designed to handle long-duration audio sessions efficiently, ensuring both scalability and reliability. For real-time transcription, the system leverages streaming protocols that process and transcribe audio in small, continuous chunks. This approach minimizes memory usage and latency, allowing the application to scale horizontally as user demand increases. For non-real-time scenarios, such as uploading pre-recorded audio, the system processes files in batches, optimizing for throughput and resource allocation. Key scalability strategies include stateless microservices, distributed task queues, and adaptive load balancing. These ensure that even as session lengths and concurrent users grow, the system maintains consistent performance and reliability. Robust error handling and checkpointing further guarantee that long sessions are not interrupted or lost, providing a seamless experience for end users.

## Architecture Comparison

| Mode      | Latency           | Reliability | Use Case                |
|-----------|-------------------|-------------|-------------------------|
| Streaming | Low (ms–sec)      | High        | Real-time transcription |
| Upload    | Higher (sec–min)  | Very High   | Post-session summary    |

### Key Decisions

- **Streaming** is used for real-time needs, prioritizing low latency and continuous feedback. It is ideal for live meetings or events where immediate transcription is critical.
- **Upload** mode is chosen for scenarios where reliability and completeness are paramount, such as after-meeting summaries or archival. This mode allows for more robust error correction and higher transcription accuracy.
- The architecture supports both modes, allowing users to select the best fit for their workflow while ensuring scalability and reliability at scale.

To get started, take a look at `src/app/page.tsx`.
