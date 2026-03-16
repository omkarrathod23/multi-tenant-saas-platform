declare module 'sockjs-client' {
  export default class SockJS {
    constructor(url: string);
    onopen?: () => void;
    onclose?: () => void;
    onmessage?: (event: { data: string }) => void;
    onerror?: (error: Error) => void;
    send(data: string): void;
    close(): void;
  }
}

