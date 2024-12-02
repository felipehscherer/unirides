package br.com.unirides.api.controllers;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/bus/schedules")
public class BusScheduleController {
    @GetMapping("/alegrete")
    public Map<String, HashMap<String, HashMap<String, ArrayList<String>>>> getSchedules(@RequestParam String url) throws IOException {
        Document doc = Jsoup.connect(url).get();
        Map<String, HashMap<String, HashMap<String, ArrayList<String>>>> allSchedules = new HashMap<>();

        Elements listItems = doc.select("li.list-group-item");

        for (Element listItem : listItems) {
            String title = listItem.select("span[itemprop=name]").text();
            HashMap<String, HashMap<String, ArrayList<String>>> schedules = new HashMap<>();
            Elements locations = listItem.select("div.card-body h3.card-title");

            for (Element location : locations) {
                String locationName = location.text();
                if (locationName.equalsIgnoreCase("Itinerário")) {
                    continue;
                }

                HashMap<String, ArrayList<String>> dailySchedules = new HashMap<>();
                ArrayList<String> weekdayTimes = new ArrayList<>();
                ArrayList<String> saturdayTimes = new ArrayList<>();

                Elements weekdaySections = location.parent().select("div:contains(Dias Úteis) ~ div.buttonH");
                for (Element time : weekdaySections) {
                    weekdayTimes.add(time.text());
                }

                Elements saturdaySections = location.parent().select("div:contains(Sábados) ~ div.buttonH");
                for (Element time : saturdaySections) {
                    saturdayTimes.add(time.text());
                }

                dailySchedules.put("Dias Úteis", weekdayTimes);
                dailySchedules.put("Sábados", saturdayTimes);
                schedules.put(locationName, dailySchedules);
            }

            allSchedules.put(title, schedules);
        }

        return allSchedules;
    }
}
