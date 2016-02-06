#!/usr/bin/env ruby

require 'date'

class OsuMonth

	START_YEAR = 2007
	START_MONTH = 10 #OCTOBER
	COMPLETION_STRING = "COMPLETE"
	
	attr_accessor :year, :month, :is_complete
	
	def initialize(year, month, is_complete = false)
		@year = year
		@month = month
		@is_complete = is_complete
	end
	
	def self.get_valid_months()
		months = []
		(START_YEAR..Date.today.year).each do |year|
			(1..12).each do |month|
				new_month = OsuMonth.new(year, month)
				if is_valid?(new_month)
					months.push(new_month)
				end
			end
		end
		
		return months
	end
	
	def self.is_valid?(osu_month)
		case osu_month.year
		when START_YEAR
			return (osu_month.month > START_MONTH)
		when Date.today.year
			return (osu_month.month <= Date.today.month)
		else
			return true
		end
	end
	
	def to_s()
		return " " * 5 + self.year.to_s + " " + Date::MONTHNAMES[self.month].ljust(15) + " " + (is_complete ? COMPLETION_STRING : "")
	end
	
end

def mark_year_complete(year, month_list)
	month_list.each do |m|
		if m.year == year
			m.is_complete = true
		end
	end
end

# Support "2009, 'March'" and "2009, 3"
def mark_month_complete(year, month, month_list)
	if month.is_a? String
		month = Date.parse(month).month
	end
	
	month_list.each do |m|
		if m.year == year and m.month == month
			m.is_complete = true
		end
	end
end

def print_months(month_list)
	puts
	
	complete_months = 0.0
	month_list.each do |m| 
		puts m.to_s 
		if m.is_complete
			complete_months += 1
		end
	end
	
	puts
	print " " * 5 + (complete_months / month_list.size * 100).round(2).to_s + "% Finished."
	puts
	
end

month_list = OsuMonth.get_valid_months

#add months I have completed
mark_year_complete(2007, month_list)
Date::MONTHNAMES[Date::MONTHNAMES.index("January")..Date::MONTHNAMES.index("November")].each { | m | mark_month_complete(2008, m, month_list) }

print_months(month_list)

