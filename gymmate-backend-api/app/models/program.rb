class Program < ApplicationRecord
  belongs_to :trainer
  has_many :exercises
  has_many :stars
  has_many :views, as: :viewable
end
