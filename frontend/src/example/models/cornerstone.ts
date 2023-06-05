export interface UseCornerstone {
  imageIndex: number;
  setImageIndex: React.Dispatch<React.SetStateAction<number>>;
  itemSrcArray: string[];

  ITEM_LENGTH: number;
  LEFT_MOUSE_TOOLS: Tool[];
  RIGHT_MOUSE_TOOLS: Tool[];
  OVERLAY_TOOLS: Tool[];

  colorMapList: {
    id: any;
    key: any;
  }[];
  itemLayers: Layer[];
}

export interface Tool {
  name: string;
  func: any;
  subTools: any[];
  config: {};
}

export interface Layer {
  images: string[];
  layerId: string;
  options: {
    visible: boolean;
    opacity: number;
    name: string;
    viewport: {
      colormap: string;
    };
  };
}

export interface ExampleOption {
  name: string;
  description: {
    en: string;
    kor: string;
  };
}
