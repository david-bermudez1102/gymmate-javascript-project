class Video < ApplicationRecord
  has_one :medium, as: :mediable
  has_many :views, as: :viewable
end
