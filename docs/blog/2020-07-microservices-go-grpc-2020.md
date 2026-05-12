---
title: Microservices With Go and gRPC
date: July 5, 2020
slug: microservices-go-grpc-2020
---

Go and gRPC became the standard stack for microservices in 2020. Go for the runtime — fast startup, small binaries, good concurrency. gRPC for the transport — fast, typed, streaming-capable. By 2026, this combination is proven at massive scale. Companies like Uber, Docker, Twitch, and Dropbox use Go and gRPC for their core infrastructure. The stack is boring in the best way — it's reliable, well-understood, and performs predictably.

## Why Go

Go compiles to a static binary. A Go service ships as a single executable — no runtime, no interpreter, no dependencies. The Docker image is 10-20MB. Startup is milliseconds. Memory usage is predictable. This makes Go ideal for microservices where deployment speed, resource efficiency, and operational simplicity matter.

I migrated a Python microservice to Go in 2020. The Python service had a 400MB Docker image (Python runtime + dependencies), started in 15 seconds, and used 200MB RAM under light load. The Go version had a 12MB Docker image, started in 200ms, and used 30MB RAM. The operational overhead dropped immediately. No more worrying about Python version compatibility, pip dependency resolution, or Gunicorn worker configuration.

Go's concurrency model (goroutines, channels) maps well to microservice patterns. A typical API server handles thousands of concurrent requests using goroutines. The standard library's `net/http` is production-grade — you can build a complete API server without external dependencies. For more complex routing, Chi or Gin provide lightweight wrappers.

## Why gRPC

gRPC uses Protocol Buffers for interface definition and serialization. The `.proto` file defines the contract between services. Code generation produces client and server stubs. This means:

- **Typed contracts.** The client and server can't disagree about the interface. If the proto defines a `GetUser` RPC that returns a `User` message, both sides must implement this. Mismatches are caught at compile time, not at 3 AM in production.
- **Efficient serialization.** Protobuf is smaller and faster than JSON for internal traffic. A typical JSON response of 1KB compresses to ~300 bytes in Protobuf. For high-throughput services, this reduces network bandwidth and serialization CPU usage.
- **Streaming.** gRPC supports unary, server-streaming, client-streaming, and bidirectional streaming. For real-time features (notifications, log streaming, progress updates), this eliminates polling and websocket management.
- **HTTP/2.** Multiplexed connections, header compression, low latency. A single TCP connection handles multiple concurrent RPCs, reducing connection overhead.

The migration from REST+JSON to gRPC for internal services cut our p99 latency by 30% on the network layer alone. The typed contracts eliminated an entire class of integration bugs. If you've ever debugged a "field `user_id` is sometimes a string and sometimes an integer" issue from a REST API, you'll appreciate Protobuf's strict typing.

## The Pattern

A typical Go gRPC service structure:

```
service/
├── cmd/
│   └── server/
│       └── main.go       # Entry point, server setup
├── internal/
│   ├── server/
│   │   └── handler.go    # gRPC handler implementations
│   ├── service/
│   │   └── logic.go      # Business logic
│   └── storage/
│       └── db.go         # Data access
├── api/
│   └── proto/
│       └── service.proto # Protobuf definition
└── go.mod
```

The business logic layer has no knowledge of gRPC. Handlers translate between gRPC types and domain types. This separation makes testing easier — you unit test the service layer without gRPC or network dependencies, then integration test the handlers with gRPC client stubs.

## Practical Considerations

**API gateway.** External clients don't call gRPC directly. Use a gateway (gRPC-gateway or Envoy) that exposes REST/JSON for external traffic and gRPC for internal traffic. The gRPC-gateway plugin generates a reverse proxy from your proto file, so you maintain one contract for both internal and external APIs.

**Error handling.** gRPC has structured error codes (NotFound, InvalidArgument, Internal, Unavailable). Map your domain errors to gRPC codes consistently. Create a helper function that converts domain errors to gRPC status errors. This ensures consistent error responses across all services.

**Load balancing.** gRPC's HTTP/2 multiplexing means a single connection handles multiple concurrent requests. Traditional per-request load balancing (round-robin DNS) doesn't work because clients reuse connections. Use client-side load balancing or a service mesh (Istio, Linkerd) that understands gRPC connection management. Envoy's gRPC support is excellent — it handles connection pooling, retries, and circuit breaking at the proxy level.

**Deadlines and cancellation.** Always set a deadline on gRPC calls. `ctx, cancel := context.WithTimeout(ctx, 5*time.Second)`. Without deadlines, a downstream service failure can cause cascading resource exhaustion. gRPC propagates context cancellation automatically, so a cancelled client request cancels the server-side processing.

**Observability.** Instrument gRPC calls with OpenTelemetry. Each call creates a span. The metadata propagation happens through gRPC context automatically. Configure your interceptors to inject and extract trace context. This is essential for debugging distributed systems — you can't understand performance without distributed tracing.

## When Not to Use Go+gRPC

For simple CRUD APIs with a single client (web frontend), Go+gRPC is overkill. A TypeScript backend with tRPC or Express gives you faster development and better frontend integration. Use Go+gRPC when you have multiple services communicating, when performance matters, or when you need strong contract guarantees between teams.

Go + gRPC is a proven, boring, reliable choice for microservices. It's not trendy. It works. The stack has been in production at scale for over six years. The patterns are well-documented. The tooling is mature. For internal service-to-service communication, there's no better option in 2026.
