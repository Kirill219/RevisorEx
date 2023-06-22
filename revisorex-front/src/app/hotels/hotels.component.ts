import {Component, ViewChild} from '@angular/core';
import {Hotel} from "./hotel.model";
import {HotelsService} from "./hotels.service";
import {User} from "../users/user.model";
import {UsersService} from "../users/users.service";
import {NgbPopover} from "@ng-bootstrap/ng-bootstrap";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {forkJoin} from "rxjs";

const Regions = [
  'Одеська обл.', 'Дніпропетровська обл.', 'Чернігівська обл.', 'Харківська обл.',
  'Житомирська обла.', 'Полтавська обл.', 'Херсонська обл.', 'Київська обл.', 'Запорізька обл.',
  'Луганська обл.', 'Донецька обл.', 'Вінницька обл.', 'Миколаївська обл.', 'Авт. Рес. Крим', 'Миколаївська обл.',
  'Кіровоградська обл.', 'Сумська обл.', 'Львівська обл.', 'Черкаська обл.', 'Хмельницька обл.', 'Волинська обл.',
  'Рівненська обл.', 'Івано-Франківська обл.', 'Тернопільська обл.', 'Закарпатська обл.', 'Чернівецька обл.'
];

const Cities = ['Київ', 'Харків', 'Одеса', 'Дніпро', 'Донецьк', 'Запоріжжя', 'Львів', 'Кривий Ріг', 'Миколаїв', 'Маріуполь',
  'Луганськ', 'Вінниця', 'Макіївка', 'Севастополь', 'Сімферополь', 'Херсон', 'Полтава', 'Чернігів', 'Черкаси', 'Житомир', 'Суми',
  'Хмельницький', 'Чернівці', 'Рівне', 'Кропивницький', 'Івано-Франківськ', 'Кременчук', 'Тернопіль', 'Луцьк', 'Біла Церква',
  'Краматорськ', 'Мелітополь', 'Керч', 'Нікополь', 'Бердянськ', 'Павлоград', 'Ужгород', 'Алчевськ', 'Енергодар', 'Лисичанськ',
  'Мукачеве', 'Сєвєродонецьк', 'Авдіївка', 'Конотоп', 'Дрогобич', 'Хуст', 'Бориспіль', 'Ізмаїл', 'Бердичів', 'Новомосковськ',
  'Нововолинськ', 'Лозова', 'Бровари', 'Умань', 'Берегове', 'Вишневе', 'Артемівськ', 'Миколаївка', 'Нетішин', 'Шостка', 'Дрогобич',
  'Васильків', 'Краснодон', 'Коломия', 'Хорол', 'Сарни', 'Ніжин', 'Кременець', 'Бахмут', 'Лиман', 'Монастириська',
  'Новоград-Волинський', 'Бар', 'Богодухів', 'Нова Каховка', 'Олександрія', 'Первомайськ', 'Ізюм', 'Лутугине', 'Калуш',
  'Коростень', 'Вишгород', 'Охтирка', 'Канів', 'Прилуки', 'Овруч', 'Жовті Води', 'Олександрівка', 'Теплодар', 'Дебальцеве',
  'Покровськ', 'Миронівка', 'Скадовськ', 'Сєвєрськ', 'Дунаївці', 'Первомайський', 'Ірпінь', 'Новий Буг', 'Теребовля', 'Ромни',
  'Костянтинівка', 'Золотоноша', 'Світловодськ', 'Сміла', 'Люботин', 'Перемишляни', 'Чорнобиль', 'Рубіжне', 'Борислав',
  'Каховка', 'Стебник', 'Городок', 'Буча', 'Глухів', 'Білгород-Дністровський', 'Сватове', 'Дружківка', 'Ржищів', 'Березань',
  'Новодружеськ', 'Торецьк', 'Новий Розділ', 'Шпола', 'Любомль', 'Мелітополь', 'Лебедин', 'Тернівка', 'Лубни', 'Рівне',
  'Костопіль', 'Свалява', 'Чигирин', 'Жидачів', 'Мена', 'Хотин', 'Житомир', 'Горішні Плавні'];

@Component({
  selector: 'app-hotels',
  templateUrl: './hotels.component.html',
  styleUrls: ['./hotels.component.scss']
})
export class HotelsComponent {
  @ViewChild('popover') popover!: NgbPopover;
  @ViewChild('popoverDelete') popoverDelete!: NgbPopover;
  hotelForm = new FormGroup({
    title: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    region: new FormControl('', Validators.required)
  });
  hotels: Hotel[] = [];
  regions = Regions.sort();
  cities = Cities.sort();
  titleFilter: string = '';
  filters: any = {};
  user!: User;
  regionName!: string;
  cityName!: string;
  errorMessage: string = '';
  loading: boolean = true;

  constructor(
    private hotelService: HotelsService,
    private userService: UsersService
  ) {}

  ngOnInit(): void {
    const hotels$ = this.hotelService.getHotels();
    const user$ = this.userService.getCurrentUser();

    forkJoin([user$, hotels$]).subscribe(
      ([user, hotels]) => {
        this.user = user;
        this.hotels = hotels;
        this.loading = false;
      },
      (error) => {
        console.log('Error loading data:', error);
        this.loading = false;
      }
    );
  }

  loadHotels(filters?: {}): void {
    this.hotelService.getHotels(filters).subscribe(
      (hotels: Hotel[]) => {
        this.hotels = this.searchTasksByTitle(hotels, this.titleFilter);
        this.titleFilter = '';
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  loadCurrentUser(): void {
    this.userService.getCurrentUser().subscribe(
      (user: User) => {
        this.user = user;
      },
      (error) => {
        console.error(error);
      })
  }

  searchTasksByTitle(hotels: Hotel[], searchText: string): Hotel[] {
    if (searchText !== '') {
      return hotels.filter(hotel =>
        hotel.title.toLowerCase().includes(searchText.toLowerCase())
      );
    } else {
      return hotels;
    }
  }

  filterData(filterName: string, value: string) {
    this.titleFilter = '';
    let filters = { ...this.filters, [filterName]: value };
    this.loadHotels(filters);
  }

  deleteHotel(hotelId: string): void {
    this.hotelService.deleteHotel(hotelId).subscribe(
      () => {
        this.hotels = this.hotels.filter((hotel: Hotel) => hotel._id !== hotelId);
        this.popoverDelete.close();
      },
      (error) => {
        console.error('Failed to delete tag', error);
      }
    );
  }

  createHotel(): void {
    const hotelData = this.hotelForm.value;
    this.hotelService.createHotel(hotelData).subscribe(
      (hotel: Hotel) => {
        this.popover.close();
        this.loadHotels();
      },
      (error) => {
        this.errorMessage = 'Готель вже існує, створіть інший'
      }
    );
  }

  setCity(title: string): void {
    this.cityName = title;
    this.hotelForm.controls.city.setValue(title);
  }

  setRegion(title: string): void {
    this.regionName = title;
    this.hotelForm.controls.region.setValue(title);
  }

  reset(): void {
    this.hotelForm.reset();
    this.cityName = '-';
    this.regionName = '-';
    this.errorMessage = '';
  }
}
