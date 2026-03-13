package com.coffee.franchise.api.service.Impl;

import com.cloudinary.Cloudinary;
import com.coffee.franchise.api.exception.AppException;
import com.coffee.franchise.api.service.CloudinaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryServiceImpl implements CloudinaryService {

    private Cloudinary cloudinary;

    public CloudinaryServiceImpl(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    @Override
    public String uploadImage(MultipartFile file) throws IOException {
        try {
                 Map uploadImage =cloudinary.uploader().upload(
                         file.getBytes(),
                          Map.of("folder","franchise-app/img"
                                  ,"resource_type","auto"

                          )

                 );
                 return uploadImage.get("secure_url").toString();
        }catch (Exception ex){
              throw new AppException(
                      HttpStatus.BAD_REQUEST,"Upload image failed"
              );
        }
    }
}
