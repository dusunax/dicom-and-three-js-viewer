# not working at the moment

import os
import argparse
import pydicom
import numpy as np
import nrrd


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

    return image  # Return the modified image array without converting it to np.array

def main(input_dir, output_dir):
    # Loading the scans and converting to Hounsfield Units (HU)
    patient_scans = load_scan(input_dir)
    patient_images = get_pixels_hu(patient_scans)

    # Saving the images as NRRD file
    nrrd_data = {
        "data": patient_images,
        "space": "left-posterior-superior",
        "space directions": np.eye(3),
        "space origin": (0, 0, 0),
        "thicknesses": (1, 1, 1),
    }

    nrrd_file_path = os.path.join(output_dir, "output.nrrd")
    nrrd.write(nrrd_file_path, patient_images, nrrd_data)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Convert DICOM files to NRRD format.")
    parser.add_argument(
        "input_dir", type=str, help="Input directory containing DICOM files."
    )
    parser.add_argument(
        "output_dir", type=str, help="Output directory for the resulting NRRD file."
    )

    args = parser.parse_args()
    main(args.input_dir, args.output_dir)
