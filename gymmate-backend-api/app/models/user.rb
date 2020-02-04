class User < ApplicationRecord
  has_one :account, as: :userable, dependent: :destroy
  has_many :workouts

  def self.search(query)
    joins(:account).where('name LIKE ?', "%#{query}%")
  end
end
