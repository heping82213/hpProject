package com.alibaba.normandie.sample.controller;

import com.alibaba.normandie.sample.CharsetsMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;

@Controller
public class IndexController {

    @Resource
    ObjectMapper jsonObjectMapper;
    @Resource
    CharsetsMapper charsetsMapper;

    @RequestMapping("/index")
    @ResponseBody
    public String index(@RequestParam(value = "temp", required = false) String temp) {
        if(temp != null){
            return temp;
        }else{
            return "No Input Param";
        }
    }

    @RequestMapping("/data/index")
    @ResponseBody
    public String dataIndex(@RequestParam(value = "temp", required = false) String temp) {
        if(temp != null){
            return temp;
        }else{
            return "No Input Param";
        }
    }

    @RequestMapping(value = "/index2", method = RequestMethod.GET)
    public String dataIndex(ModelMap modelMap,@RequestParam(value = "temp", required = false) String temp) {
        modelMap.put("TestBean",temp);
        return "demo/index";
    }

    @RequestMapping("/dbTest")
    @ResponseBody
    public String dbTest() {
        try {
            return jsonObjectMapper.writeValueAsString(charsetsMapper.getCharsets());
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return "failed";
    }

}
