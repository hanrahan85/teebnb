
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

interface PhotosSectionProps {
  form: UseFormReturn<any>;
}

const PhotosSection = ({ form }: PhotosSectionProps) => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const photos = form.watch('photos') || [];
  const coverImage = form.watch('coverImage');

  const uploadPhoto = async (file: File) => {
    if (!user) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('property-images')
      .upload(fileName, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('property-images')
      .getPublicUrl(data.path);

    return publicUrl;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(file => uploadPhoto(file));
      const uploadedUrls = await Promise.all(uploadPromises);
      
      const validUrls = uploadedUrls.filter(url => url !== null) as string[];
      const currentPhotos = photos;
      const newPhotos = [...currentPhotos, ...validUrls];
      
      form.setValue('photos', newPhotos);
      
      // Set first uploaded photo as cover image if none is selected
      if (!coverImage && validUrls.length > 0) {
        form.setValue('coverImage', validUrls[0]);
      }
      
      toast.success(`${validUrls.length} photo(s) uploaded successfully`);
    } catch (error) {
      console.error('Error uploading photos:', error);
      toast.error('Failed to upload photos');
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = (index: number) => {
    const currentPhotos = photos;
    const photoToRemove = currentPhotos[index];
    const updatedPhotos = currentPhotos.filter((_: string, i: number) => i !== index);
    
    form.setValue('photos', updatedPhotos);
    
    // If removed photo was the cover image, set a new one
    if (coverImage === photoToRemove && updatedPhotos.length > 0) {
      form.setValue('coverImage', updatedPhotos[0]);
    } else if (updatedPhotos.length === 0) {
      form.setValue('coverImage', '');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Photos</h2>
        <p className="text-gray-600">Upload at least 3 high-quality photos of your property</p>
      </div>

      <div>
        <FormLabel>Upload Images (3-10 photos required)</FormLabel>
        <div className="mt-2">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <div className="text-center">
              <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <label htmlFor="photo-upload" className="cursor-pointer">
                  <Button type="button" variant="outline" disabled={uploading}>
                    <Upload className="mr-2 h-4 w-4" />
                    {uploading ? 'Uploading...' : 'Choose Photos'}
                  </Button>
                  <Input
                    id="photo-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={uploading}
                  />
                </label>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                PNG, JPG, GIF up to 10MB each. Select multiple files.
              </p>
            </div>
          </div>
        </div>

        {photos.length > 0 && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
            {photos.map((photo: string, index: number) => (
              <div key={index} className="relative group">
                <img
                  src={photo}
                  alt={`Property photo ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removePhoto(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
                {photo === coverImage && (
                  <Badge className="absolute bottom-2 left-2 bg-emerald-600">
                    Cover Photo
                  </Badge>
                )}
              </div>
            ))}
          </div>
        )}

        <FormField
          control={form.control}
          name="photos"
          render={() => (
            <FormItem>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {photos.length > 0 && (
        <FormField
          control={form.control}
          name="coverImage"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Select Cover Image</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="grid grid-cols-2 md:grid-cols-3 gap-4"
                >
                  {photos.map((photo: string, index: number) => (
                    <div key={index} className="relative">
                      <RadioGroupItem
                        value={photo}
                        id={`cover-${index}`}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={`cover-${index}`}
                        className="block cursor-pointer rounded-lg border-2 border-gray-200 peer-checked:border-emerald-600 peer-checked:ring-2 peer-checked:ring-emerald-600"
                      >
                        <img
                          src={photo}
                          alt={`Cover option ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};

export default PhotosSection;
