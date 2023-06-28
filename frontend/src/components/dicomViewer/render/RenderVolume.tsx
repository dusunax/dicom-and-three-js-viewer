import SectionWrap from "../components/common/SectionWrap";
import useCornerstone3D from "../hooks/useCornerstone3D";

export default function RenderVolume() {
  // const {} = useCornerstone3D();

  // const volumeId = "cornerstoneStreamingImageVolume: myVolume";
  // const volume = await volumeLoader.createAndCacheVolume(volumeId, { imageIds });

  //   const imageIds = await createImageIdsAndCacheMetaData({
  //   StudyInstanceUID:
  //     '1.3.6.1.4.1.14519.5.2.1.7009.2403.334240657131972136850343327463',
  //   SeriesInstanceUID:
  //     '1.3.6.1.4.1.14519.5.2.1.7009.2403.226151125820845824875394858561',
  //   wadoRsRoot: 'https://d3t6nz73ql33tx.cloudfront.net/dicomweb',
  // });

  const buffer = new SharedArrayBuffer(16);
  console.log(buffer);

  return (
    <SectionWrap title="Render 3D Volume">
      <div id="content"></div>
      <div className="w-[800px] mx-auto pt-4 flex gap-2">
        <div className="bg-black flex-1 h-[400px]" />
        <div className="bg-black flex-1 h-[400px]" />
      </div>
    </SectionWrap>
  );
}
