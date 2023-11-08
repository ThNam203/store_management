package com.springboot.store.service.impl;

import com.springboot.store.entity.Location;
import com.springboot.store.payload.LocationDTO;
import com.springboot.store.repository.LocationRepository;
import com.springboot.store.service.LocationService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LocationServiceImpl implements LocationService {
    private final LocationRepository locationRepository;
    private final ModelMapper modelMapper;

    @Override
    public LocationDTO getLocationById(int id) {
        Location location = locationRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Location not found with id: " + id));
        return modelMapper.map(location, LocationDTO.class);
    }

    @Override
    public List<LocationDTO> getAllLocations() {
        List<Location> locations = locationRepository.findAll();
        return locations.stream()
                .map(location -> modelMapper.map(location, LocationDTO.class))
                .collect(java.util.stream.Collectors.toList());
    }

    @Override
    public LocationDTO createLocation(LocationDTO locationDTO) {
        Location location = modelMapper.map(locationDTO, Location.class);
        location = locationRepository.save(location);
        return modelMapper.map(location, LocationDTO.class);
    }

    @Override
    public LocationDTO updateLocation(int id, LocationDTO locationDTO) {
        Location existingLocation = locationRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Location not found with id: " + id));
        existingLocation.setName(locationDTO.getName());
        existingLocation = locationRepository.save(existingLocation);
        return modelMapper.map(existingLocation, LocationDTO.class);
    }

    @Override
    public void deleteLocation(int id) {
        locationRepository.deleteById(id);
    }
}