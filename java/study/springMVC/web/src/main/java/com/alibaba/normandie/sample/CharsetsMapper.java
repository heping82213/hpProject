package com.alibaba.normandie.sample;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;

public interface CharsetsMapper {
    @Select("SELECT * FROM character_sets")
    @Results({
        @Result(property = "characterSetName", column = "character_set_name"),
        @Result(property = "defaultCollateName", column = "default_collate_name")
    })
    List<CharsetsDO> getCharsets();
    
    @Select("SELECT * FROM character_sets WHERE CHARACTER_SET_NAME = #{characterSetName}")
    @Results({
        @Result(property = "characterSetName", column = "character_set_name"),
        @Result(property = "defaultCollateName", column = "default_collate_name")
    })
    CharsetsDO getCharset(@Param("characterSetName") String characterSetName);
}
