package com.alibaba.normandie.sample;

import lombok.Data;

@Data
public class CharsetsDO {
    private String characterSetName;
    private String defaultCollateName;
    private String description;
    private Integer maxLen;
}
