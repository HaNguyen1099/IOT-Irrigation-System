#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <NTPClient.h>
#include <WiFiUdp.h>
#include <vector>

#define sensorPower 4 
const int sensorPin = 32; // đọc giá trị từ cảm biến độ ẩm đất
const int pumpPin = 22; // điều khiển máy bơm 
const char *ssid = "Hello cậu"; 
const char *password = "12345666";

const char* apiKey = "7617f9f7ffa6403c8c603928242709"; 
const char* location = "Hanoi"; 
int humidityPercentage = 0;
int a[30]; // lưu dữ liệu khả năng mưa từng giờ
int max1 = 0; // khả năng mưa max khung sáng
int max2 = 0; // khả năng mưa max khung chiều tối
std::vector<String> timeList; 

WiFiUDP ntpUDP; 
NTPClient timeClient(ntpUDP, "asia.pool.ntp.org", 7 * 3600); 

// URLs của ThingSpeak
String apiUrlWrite = "http://api.thingspeak.com/update?api_key=RI5JU97LWBTYQW9N";
String apiUrlRead = "http://api.thingspeak.com/channels/2674054/feeds.json?api_key=7UN1PZEEFOM2V5RX&results=2";

// Hàm tìm giá trị lớn nhất trong khoảng thời gian
int findmax(int k, int b) {
  int maxx = 0;
  for (int i = k; i <= b; i++) {
    if (a[i] > maxx) {
      maxx = a[i];
    }
  }
  return maxx;
}

void setup() {
  pinMode(sensorPower, OUTPUT); 
  digitalWrite(sensorPower, HIGH); // Cấp nguồn cho cảm biến độ ẩm 
  Serial.begin(9600); 
  pinMode(pumpPin, INPUT); 
  digitalWrite(pumpPin, LOW); // Tắt máy bơm lúc khởi động
  WiFi.begin(ssid, password); // Kết nối Wifi
  Serial.println("Connecting to Wi-Fi...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to Wi-Fi...");
  }
  Serial.println("Connected to Wi-Fi");
  timeClient.begin();
  
  thoitiet(); // lấy thông tin thời tiết từ API
  getTimeListFromAPI(); // Lấy danh sách thời gian tự động bơm nước từ API
  max1 = findmax(5, 15);
  max2 = findmax(16, 23);
}

void loop() {
  timeClient.update();
  String formattedTime = timeClient.getFormattedTime().substring(0, 5); // Lấy thời gian hiện tại "HH:MM"
  humidityPercentage = readSensor();

  Serial.println("Current time in Hanoi: " + formattedTime);
  Serial.print("Humidity: ");
  Serial.print(humidityPercentage);
  Serial.println("%");

  // So sánh thời gian hiện tại với danh sách thời gian từ API
  for (String time : timeList) {
    if (formattedTime == time.substring(0, 5)) { // So sánh với thời gian từ API
      Serial.println("Thời gian khớp: " + time);
      if (formattedTime.substring(0, 2).toInt() >= 18) {
        bomtudong(humidityPercentage, max2);
      } else {
        bomtudong(humidityPercentage, max1);
      }
    }
  }

  // Lấy trạng thái máy bơm từ API
  String pumpStatus = getPumpStatus();
  if (pumpStatus == "1") {
    batmay();
  } else {
    tatmay();
  }

  sendToThingSpeak(humidityPercentage); 

  delay(2000);
}

void bomtudong(int doam, int mua) {
  if (doam >= 80 || mua >= 80) {
    Serial.println("Không bơm nước vì đã đủ độ ẩm");
  } else if (mua >= 50) {
    while (doam <= 50) { 
      doam = readSensor();
      batmay();
      Serial.println("Đang bơm nước...");
    }
    Serial.println("Đã đủ nước, tắt máy bơm");
    tatmay();
  } else {
    while (doam <= 80) {
      doam = readSensor();
      batmay();
      Serial.println("Đang bơm nước...");
    }
    Serial.println("Đã đủ nước, tắt máy bơm");
    tatmay();
  }
}

// Lấy danh sách thời gian từ API
void getTimeListFromAPI() {
  HTTPClient http;
  String url = "http://192.168.48.180:3000/time"; // Địa chỉ API

  if (http.begin(url)) {
    int httpResponseCode = http.GET();
    if (httpResponseCode == HTTP_CODE_OK) {
      String payload = http.getString();
      DynamicJsonDocument doc(2048);
      deserializeJson(doc, payload);

      // Xóa danh sách cũ trước khi lưu mới
      timeList.clear();

      // Lấy dữ liệu từ API và lưu vào danh sách
      JsonArray times = doc.as<JsonArray>();
      for (JsonObject timeObject : times) {
        String time = timeObject["time"].as<String>(); // Lấy giá trị "time" từ mỗi đối tượng
        timeList.push_back(time);
        Serial.println("Time added: " + time); // In ra thời gian nhận được
      }
    } else {
      Serial.println("Error retrieving time list from API");
    }
    http.end();
  } else {
    Serial.println("Unable to connect to API");
  }
}

void sendToThingSpeak(int humidity) {
  HTTPClient http;
  String url = apiUrlWrite + "&field1=" + String(humidity); // Gửi độ ẩm vào field1
  if (http.begin(url)) {
    int httpResponseCode = http.GET();
    if (httpResponseCode == HTTP_CODE_OK) {
      Serial.println("Data sent to ThingSpeak successfully");
    } else {
      Serial.println("Error sending data to ThingSpeak");
    }
    http.end();
  } else {
    Serial.println("Unable to connect to ThingSpeak");
  }
}

void updatePumpStatus(bool isPumpOn) {
  HTTPClient http;
  String url = "http://192.168.48.180:3000/auto/create"; 

  // Tạo object JSON với trạng thái máy bơm
  DynamicJsonDocument doc(1024);
  doc["status"] = isPumpOn ? "1" : "0"; // Nếu máy bơm đang bật, gửi "1", nếu tắt thì gửi "0"

  String jsonPayload;
  serializeJson(doc, jsonPayload); // Chuyển object JSON thành chuỗi

  // In log payload để kiểm tra nội dung được gửi
  Serial.print("Payload: ");
  Serial.println(jsonPayload);

  http.begin(url);
  http.addHeader("Accept", "application/json");  // Yêu cầu nhận phản hồi dạng JSON
  http.addHeader("Content-Type", "application/json"); // Đặt header cho request JSON

  // Gửi dữ liệu JSON dưới dạng POST request
  int httpResponseCode = http.POST(jsonPayload);

  if (httpResponseCode > 0) {
    String response = http.getString(); 

    if (httpResponseCode == HTTP_CODE_OK || httpResponseCode == HTTP_CODE_CREATED) {
      Serial.println("Pump status updated successfully via API");
    } else {
      Serial.println("Error: Unexpected response code: " + String(httpResponseCode));
    }
  } else {
    Serial.print("Error in sending POST request: ") + String(httpResponseCode);
  }

  http.end(); // Kết thúc kết nối HTTP
}


String getPumpStatus() {
  HTTPClient http;
  String url = "http://192.168.48.180:3000/status/detail/1"; // Địa chỉ API
  if (http.begin(url)) {
    int httpResponseCode = http.GET();
    if (httpResponseCode == HTTP_CODE_OK) {
      String payload = http.getString();
      DynamicJsonDocument doc(1024);
      deserializeJson(doc, payload);

      // Kiểm tra object có tồn tại không
      if (doc.containsKey("status")) {
        String status = doc["status"].as<String>(); // Lấy giá trị "status"
        return status;
      } else {
        Serial.println("Field 'status' không tồn tại trong API trả về");
      }
    } else {
      Serial.println("Error retrieving pump status from API");
    }
    http.end();
  }
  return "";
}

int readSensor() {
  digitalWrite(sensorPower, HIGH);
  delay(10);
  int val = analogRead(sensorPin);
  digitalWrite(sensorPower, LOW);
  int minSensorValue = 1300;
  int maxSensorValue = 4095;
  humidityPercentage = map(val, minSensorValue, maxSensorValue, 100, 0);
  humidityPercentage = constrain(humidityPercentage, 0, 100);
  return humidityPercentage;
}

void batmay() {
  pinMode(pumpPin, OUTPUT);
  digitalWrite(pumpPin, HIGH); // Bật máy bơm
  Serial.println("Bật máy bơm");
  updatePumpStatus(true);
}

void tatmay() {
  pinMode(pumpPin, INPUT);
  digitalWrite(pumpPin, LOW); // Tắt máy bơm
  Serial.println("Tắt máy bơm");
  updatePumpStatus(false);
}

// Hàm lấy dữ liệu dự báo mưa và lưu vào mảng a[]
void thoitiet() {
  HTTPClient http;
  String url = "http://api.weatherapi.com/v1/forecast.json?key=7617f9f7ffa6403c8c603928242709&q=Hanoi&days=1";
  http.begin(url);
  int httpCode = http.GET();
  if (httpCode > 0) {
    DynamicJsonDocument jsonDocument(10240);
    deserializeJson(jsonDocument, http.getString());
    JsonArray forecastdays = jsonDocument["forecast"]["forecastday"].as<JsonArray>();
    
    int check = 0;
    for (JsonObject forecastday : forecastdays) {
      JsonArray hours = forecastday["hour"].as<JsonArray>();
      for (JsonObject hour : hours) {
        int chance_of_rain = hour["chance_of_rain"];
        a[check++] = chance_of_rain;
        Serial.print("Chance of rain: ");
        Serial.println(chance_of_rain);
      }
    }
  } else {
    Serial.println("Failed to retrieve data from API");
  }
}
