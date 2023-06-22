import os
import argparse
import pydicom
import numpy as np
import trimesh
from stl import mesh
from skimage.measure import marching_cubes



def load_scan(path):
    slices = [pydicom.dcmread(os.path.join(path, s)) for s in os.listdir(path)]
    slices.sort(key=lambda x: float(x.ImagePositionPatient[2]))
    try:
        slice_thickness = np.abs(
            slices[0].ImagePositionPatient[2] - slices[1].ImagePositionPatient[2]
        )
    except:
        slice_thickness = np.abs(slices[0].SliceLocation - slices[1].SliceLocation)

    for s in slices:
        s.SliceThickness = slice_thickness

    return slices


def get_pixels_hu(scans):
    image = np.stack([s.pixel_array for s in scans])
    image = image.astype(np.int16)

    image[image == -2000] = 0

    for slice_number in range(len(scans)):
        intercept = scans[slice_number].RescaleIntercept
        slope = scans[slice_number].RescaleSlope

        if slope != 1:
            image[slice_number] = slope * image[slice_number].astype(np.float64)
            image[slice_number] = image[slice_number].astype(np.int16)

        image[slice_number] += np.int16(intercept)

    return np.array(image, dtype=np.int16)

# (volume, level=None, *, spacing=(1., 1., 1.), gradient_direction='descent', step_size=1, allow_degenerate=True, method='lewiner', mask=None)
def create_mesh(image, threshold=700):
    v, f, _, _ = marching_cubes(image, level=threshold, step_size=2)
    f = f[:, ::-1]  # reverse the vertex order of faces
    return trimesh.Trimesh(vertices=v, faces=f, process=False)

def main(input_dir, output_dir):
    # Loading the scans and converting to Hounsfield Units (HU)
    patient_scans = load_scan(input_dir)
    patient_images = get_pixels_hu(patient_scans)

    # Creating a mesh and saving it to a .ply file
    msh = create_mesh(patient_images)
    msh.export(os.path.join(output_dir, 'mesh.ply'))

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Convert DICOM files to a PLY mesh.")
    parser.add_argument(
        "input_dir", type=str, help="Input directory containing DICOM files."
    )
    parser.add_argument(
        "output_dir", type=str, help="Output directory for the resulting PLY file."
    )

    args = parser.parse_args()
    main(args.input_dir, args.output_dir)
