// components/ImageUpload.js

import { useState } from 'react';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../lib/firebaseConfig';

export default function ImageUpload() {
  

  return (
    <div>
      <input type="file" onChange={handleChange} />
      <button onClick={handleUpload}>Upload</button>
      <div>Progress: {progress}%</div>
      {imageUrl && <img src={imageUrl} alt="Uploaded" width="100" height="100" />}
    </div>
  );
}
