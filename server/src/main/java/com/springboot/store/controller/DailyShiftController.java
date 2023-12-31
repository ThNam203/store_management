package com.springboot.store.controller;

import com.springboot.store.payload.DailyShiftDTO;
import com.springboot.store.service.DailyShiftService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/daily-shifts")
@RequiredArgsConstructor
public class DailyShiftController {
    private final DailyShiftService dailyShiftService;

    @PostMapping
    public ResponseEntity<List<DailyShiftDTO>> createDailyShifts(@RequestBody List<DailyShiftDTO> dailyShiftDTOList) {
        return ResponseEntity.ok(dailyShiftService.createDailyShifts(dailyShiftDTOList));
    }

    @GetMapping
    public ResponseEntity<?> getAllDailyShifts() {
        return ResponseEntity.ok(dailyShiftService.getAllDailyShifts());
    }

    @PutMapping("/{dailyShiftId}")
    public ResponseEntity<DailyShiftDTO> updateDailyShift(@PathVariable int dailyShiftId, @RequestBody DailyShiftDTO dailyShiftDTO) {
        return ResponseEntity.ok(dailyShiftService.updateDailyShift(dailyShiftId, dailyShiftDTO));
    }

    @GetMapping("/{dailyShiftId}")
    public ResponseEntity<DailyShiftDTO> getDailyShift(@PathVariable int dailyShiftId) {
        return ResponseEntity.ok(dailyShiftService.getDailyShift(dailyShiftId));
    }

    @DeleteMapping("/{dailyShiftId}")
    public ResponseEntity<Void> deleteDailyShift(@PathVariable int dailyShiftId) {
        dailyShiftService.deleteDailyShift(dailyShiftId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/update")
    public ResponseEntity<List<DailyShiftDTO>> updateDailyShifts(@RequestBody List<DailyShiftDTO> dailyShiftDTOList) {
        return ResponseEntity.ok(dailyShiftService.updateDailyShifts(dailyShiftDTOList));
    }

}
