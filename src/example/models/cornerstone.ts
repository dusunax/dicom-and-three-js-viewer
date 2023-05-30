export interface UseCornerstone {
  imageIndex: number;
  setImageIndex: React.Dispatch<React.SetStateAction<number>>;
  itemSrcArray: string[];
  ITEM_LENGTH: number;
  leftMouseToolChain: {
    name: string;
    func: any;
    config: {};
  }[];
  colorMapList: {
    id: any;
    key: any;
  }[];
  itemLayers: Layer[];
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
