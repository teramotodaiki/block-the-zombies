export interface Vector2 {
    x: number;
    y: number;
}

export enum TileType {
    Empty = 0,
    Ground = 1,
    Bedrock = 2,
    Magma = 3,
    Goal = 4,
}

export enum Direction {
    Left = -1,
    Right = 1,
}
