'use client';
import config from '@/lib/config';
import { IKImage, ImageKitProvider, IKUpload } from 'imagekitio-next';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const authenticator = async () => {
  try {
    const response = await fetch(`${config.env.api.endpoint}/api/auth/imagekit`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const { signature, expire, token } = data;

    return { signature, expire, token };
  } catch (error: any) {
    throw new Error(`Authentication request failed: ${error.message}}`);
  }
};

interface ImageUploadProps {
  onFileChange: (filePath: string) => void;
}

export default function ImageUpload({ onFileChange }: ImageUploadProps) {
  const ikUploadRef = useRef(null);
  const [file, setFile] = useState<{ filePath: string } | null>(null);
  const { toast } = useToast();

  const onError = (error: any) => {
    console.error(error);
    toast({
      title: 'Image uploaded failed',
      description: `Your image could not be uploaded. Please try again.`,
      variant: 'destructive',
    });
  };
  const onSuccess = (res: any) => {
    setFile(res);
    onFileChange(res.filePath);
    toast({
      title: 'Image uploaded successfully',
      description: `${res.filePath} uploaded`,
    });
  };

  return (
    <ImageKitProvider publicKey={config.env.imagekit.publicKey} urlEndpoint={config.env.imagekit.urlEndpoint} authenticator={authenticator}>
      <IKUpload className="hidden" ref={ikUploadRef} onError={onError} onSuccess={onSuccess} fileName="test-upload.png" />
      <button
        className="upload-btn"
        onClick={e => {
          e.preventDefault();
          if (ikUploadRef.current) {
            // @ts-ignore
            ikUploadRef.current?.click();
          }
        }}
      >
        <Image src="icons/upload.svg" alt="upload" height={20} width={20} className="object-contain" />
        <p className="text-base text-light-100">Upload a File</p>
        {file && <p className="upload-filename">{file.filePath}</p>}
      </button>
      {file && <IKImage alt={file.filePath} path={file.filePath} width={500} height={300} />}
    </ImageKitProvider>
  );
}
